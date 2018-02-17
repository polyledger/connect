"""
This module creates optimal portfolio allocations, given a risk score.

Usage:

>>> from allocator import CVaR, MVO
>>> symbols = ['BTC', 'ETH', 'LTC', 'XRP']
>>> allocator = CVaR(symbols, trials=1000000, percentile=5)
>>> allocator.allocate()
 (Prints allocation)

>>> allocator = MVO(symbols)
>>> allocator.allocate()
 (Prints allocation)

"""

import json
import time
import math
import warnings
import numpy as np
import pandas as pd
from datetime import datetime
from api.models import Price, Distribution, Coin
from django_celery_results.models import TaskResult
from scipy.optimize import minimize
from scipy import stats


class Allocator(object):

    def __init__(
        self,
        symbols,
        start,
        end=datetime.today(),
        task_id=None
    ):
        self.task_id = task_id
        self.symbols = sorted(symbols)
        self.start = start
        self.end = end

    def retrieve_data(self):
        """
        Retrives data as a DataFrame.
        """

        # Filter Price objects by date and coins
        date__gte = self.start
        coin__in = self.symbols
        queryset = Price.objects.filter(
            date__gte=date__gte,
            coin__in=coin__in
        ).values().order_by('-date', 'coin')

        # Set DataFrame options
        data = queryset
        index = 'date'
        columns = ['date', 'coin_id', 'price']

        # Create DataFrame from queryset
        df = pd.DataFrame.from_records(data=data, index=index, columns=columns)
        df.rename(columns={'coin_id': 'coin'}, inplace=True)
        df.reset_index(inplace=True)
        df = pd.pivot_table(
            data=df,
            values='price',
            index='date',
            columns='coin',
            aggfunc='first')
        df.replace(0, np.nan, inplace=True)

        return df

    def solve_minimize(
        self,
        func,
        weights,
        constraints,
        lower_bound=0.0,
        upper_bound=1.0,
        func_deriv=False
    ):
        """
        Returns the solution to a minimization problem.
        """

        bounds = ((lower_bound, upper_bound), ) * len(self.symbols)
        return minimize(
            fun=func, x0=weights, jac=func_deriv, bounds=bounds,
            constraints=constraints, method='SLSQP', options={'disp': False}
        )

    def minimize_risk(self, func, func_deriv=False):
        """
        Minimizes the conditional value at risk of a portfolio.
        """

        # Set sample weights
        weights = [1 / len(self.symbols)] * len(self.symbols)
        constraints = (
            {'type': 'eq', 'fun': lambda weights: (weights.sum() - 1)}
        )
        solution = self.solve_minimize(
            func=func,
            weights=weights,
            constraints=constraints,
            func_deriv=func_deriv)
        return solution.x

    def maximize_returns(self, func, func_deriv=False):
        """
        Maximizes the returns of a portfolio.
        """

        # Set sample weights
        weights = [1/len(self.symbols)] * len(self.symbols)
        constraints = (
            {'type': 'eq', 'fun': lambda weights: (weights.sum() - 1)}
        )
        solution = self.solve_minimize(
            func=func,
            weights=weights,
            constraints=constraints,
            func_deriv=func_deriv)
        max_return = solution.fun * -1
        return max_return

    def efficient_frontier(
        self,
        func,
        returns,
        min_return,
        max_return,
        points,
        func_deriv=False
    ):
        """
        Returns a DataFrame of efficient portfolio allocations.
        """
        points = np.linspace(min_return, max_return, points)
        columns = [symbol for symbol in self.symbols]
        values = pd.DataFrame(columns=columns)
        weights = [1 / len(self.symbols)] * len(self.symbols)

        for idx, val in enumerate(points):
            constraints = (
                {'type': 'eq', 'fun': lambda weights: (weights.sum() - 1)},
                {'type': 'ineq', 'fun': lambda weights: (
                    np.dot(weights, returns) - val
                )}
            )
            solution = self.solve_minimize(
                func=func,
                weights=weights,
                constraints=constraints,
                func_deriv=func_deriv)

            columns = {}
            for index, symbol in enumerate(self.symbols):
                columns[symbol] = math.floor(solution.x[index] * 10000)/100

            values = values.append(columns, ignore_index=True)
        return values


class CVaR(Allocator):

    def __init__(
        self,
        symbols,
        start,
        end=datetime.today(),
        trials=100000,
        percentile=5,
        task_id=None
    ):
        Allocator.__init__(self, symbols, start, end, task_id)
        self.trials = trials
        self.percentile = percentile

    def cvar(self, portfolio_returns):
        """
        Calculate conditional value at risk.
        """
        value = np.percentile(a=portfolio_returns, q=self.percentile)

        if self.percentile < 50:
            result = portfolio_returns[portfolio_returns < value].mean()
        else:
            result = portfolio_returns[portfolio_returns > value].mean()
        return result

    def generate_sample_returns(self, dist, params):
        """
        Generate samples using the best fit distibution
        """
        arg = params[:-2]
        loc = params[-2]
        scale = params[-1]
        sample_returns = dist.rvs(loc=loc, scale=scale, *arg, size=self.trials)
        return sample_returns

    def fit_distribution(self, returns):
        """
        Find the best-fitting distributions for each symbol
        """
        bins = 30
        data = returns.dropna(inplace=False)

        # Get histogram of original data
        y, x = np.histogram(data, bins=bins, density=True)
        x = (x + np.roll(x, -1))[:-1] / 2.0

        # Distributions to check
        dist_names = [
            'alpha', 'anglit', 'arcsine', 'beta', 'betaprime', 'bradford',
            'burr', 'cauchy', 'chi', 'chi2', 'cosine', 'dgamma', 'dweibull',
            'erlang', 'expon', 'exponnorm', 'exponweib', 'exponpow', 'f',
            'fatiguelife', 'fisk', 'foldcauchy', 'foldnorm', 'frechet_r',
            'frechet_l', 'genlogistic', 'genpareto', 'gennorm', 'genexpon',
            'genextreme', 'gausshyper', 'gamma', 'gengamma', 'genhalflogistic',
            'gilbrat', 'gompertz', 'gumbel_r', 'gumbel_l', 'halfcauchy',
            'halflogistic', 'halfnorm', 'halfgennorm', 'hypsecant', 'invgamma',
            'invgauss', 'invweibull', 'johnsonsb', 'johnsonsu', 'ksone',
            'kstwobign', 'laplace', 'levy', 'levy_l', 'levy_stable',
            'logistic', 'loggamma', 'loglaplace', 'lognorm', 'lomax',
            'maxwell', 'mielke', 'nakagami', 'ncx2', 'ncf', 'nct', 'norm',
            'pareto', 'pearson3', 'powerlaw', 'powerlognorm', 'powernorm',
            'rdist', 'reciprocal', 'rayleigh', 'rice', 'recipinvgauss',
            'semicircular', 't', 'triang', 'truncexpon', 'truncnorm',
            'tukeylambda', 'uniform', 'vonmises', 'vonmises_line', 'wald',
            'weibull_min', 'weibull_max', 'wrapcauchy'
        ]

        # Keep track of the best fitting distribution, parameters, and SSE
        best_dist = stats.norm
        best_dist_params = (0.0, 1.0)
        best_dist_sse = np.inf

        # Estimate distribution parameters from data
        for dist_name in dist_names:
            try:
                with warnings.catch_warnings():
                    warnings.filterwarnings('ignore')

                    dist = getattr(stats, dist_name)
                    params = dist.fit(data)  # Fit distribution to data

                    # Separate parts of parameters
                    arg = params[:-2]
                    loc = params[-2]
                    scale = params[-1]

                    # Calculate fitted PDF and error with fit in distribution
                    pdf = dist.pdf(x, loc=loc, scale=scale, *arg)
                    sse = np.sum(np.power(y - pdf, 2.0))

                    # Determine if this distribution is a better fit
                    if best_dist_sse > sse > 0:
                        best_dist = dist
                        best_dist_params = params
                        best_dist_sse = sse

            except Exception:
                # TODO: May want to handle this exception.
                pass

        return (best_dist, best_dist_params)

    def allocate(self):
        """
        Returns an efficient portfolio allocation for the given risk index.
        """
        # Time allocation function for static analysis
        start_time = time.time()

        # DataFrame to hold generated sample returns for each coin
        sample_returns = pd.DataFrame(columns=self.symbols)

        # Set current task_id progress
        current = 0
        total = len(self.symbols) + 3
        task_result = TaskResult.objects.get(task_id=self.task_id)
        task_result.state = 'PROGRESS'
        task_result.save()

        for symbol in self.symbols:
            task_result.meta = json.dumps({
                'current': current,
                'total': total,
                'message': 'Optimizing for {0}...'.format(symbol)
            })
            task_result.save()
            coin = Coin.objects.get(symbol=symbol)
            distribution = Distribution.objects.filter(coin=coin).first()
            dist = getattr(stats, distribution.name)
            params = tuple(map(float, distribution.params.split(',')))
            sample_returns[symbol] = self.generate_sample_returns(dist, params)
            current += 1

        task_result.meta = json.dumps({
            'current': current,
            'total': total,
            'message': 'Minimizing risk...'
        })
        task_result.save()
        current += 1

        # Minimum risk CVaR optimization
        def func(weights):
            """The objective function that minimizes risk."""
            portfolio_returns = (sample_returns * weights).sum(1)
            return self.cvar(portfolio_returns) * -1

        allocation = self.minimize_risk(func)
        min_return = np.dot(allocation, sample_returns.mean())

        task_result.meta = json.dumps({
            'current': current,
            'total': total,
            'message': 'Maximizing returns...'
        })
        task_result.save()
        current += 1

        # Maximum return CVaR optimization
        def func(weights):
            """The objective function that maximizes returns."""
            portfolio_returns = (sample_returns * weights).sum(1)
            return portfolio_returns.mean() * -1

        max_return = self.maximize_returns(func)

        task_result.meta = json.dumps({
            'current': current,
            'total': total,
            'message': 'Finalizing allocation...'
        })
        task_result.save()
        current += 1

        # Generate an efficient frontier
        def func(weights):
            """The objective function that minimizes the CVaR"""
            portfolio_returns = (sample_returns * weights).sum(1)
            return self.cvar(portfolio_returns) * -1

        frontier = self.efficient_frontier(
            func=func,
            returns=sample_returns.mean(),
            min_return=min_return,
            max_return=max_return,
            points=6,
            func_deriv=False
        )

        task_result.meta = json.dumps({
            'current': current,
            'total': total,
            'message': 'Complete'
        })
        task_result.save()

        sec = time.time() - start_time
        print('Function allocate completed in {0:0.1f} seconds.'.format(sec))
        return frontier


class MVO(Allocator):

    def __init__(self, symbols, start, end=datetime.today()):
        Allocator.__init__(self, symbols, start, end)

    def allocate(self):
        """
        Returns an efficient portfolio allocation for the given risk index.
        """
        # Time allocation function for static analysis
        start_time = time.time()

        prices = self.retrieve_data()

        # Calculate the daily changes
        change_columns = []
        for column in prices:
            if column in self.symbols:
                change_column = '{}_change'.format(column)
                values = pd.Series(
                    (prices[column].shift(-1) - prices[column]) /
                    -prices[column].shift(-1)
                ).values
                prices[change_column] = values
                change_columns.append(change_column)

        # Variances and returns
        columns = change_columns
        returns = prices[columns].apply(np.nanmean, axis=0)

        # Calculate risk and expected return
        cov_matrix = prices[columns].cov()

        # The diagonal variances aren't calculated correctly, so here is a fix.
        cols = [np.arange(len(self.symbols))]
        cov_matrix.values[cols * 2] = prices[columns].apply(np.nanvar, axis=0)

        # Calculate portfolio with the minimum risk
        def func(weights):
            """The objective function that minimizes variance."""
            return np.matmul(np.matmul(weights.transpose(), cov_matrix),
                             weights)

        def func_deriv(weights):
            """The derivative of the objective function."""
            return (
                np.matmul(weights.transpose(), cov_matrix.transpose()) +
                np.matmul(weights.transpose(), cov_matrix)
            )

        min_risk = self.minimize_risk(func, func_deriv=func_deriv)
        min_return = np.dot(min_risk, returns.values)

        # Calculate portfolio with the maximum return
        def func(weights):
            """The objective function that maximizes returns."""
            return np.dot(weights, returns.values) * -1

        max_return = self.maximize_returns(func)

        # Calculate efficient frontier
        def func(weights):
            """The objective function that minimizes variance."""
            return np.matmul(np.matmul(weights.transpose(), cov_matrix),
                             weights)

        frontier = self.efficient_frontier(
            func=func,
            returns=returns.values,
            min_return=min_return,
            max_return=max_return,
            points=6,
            func_deriv=func_deriv
        )
        sec = time.time() - start_time
        print('Function allocate completed in {0:0.1f} seconds.'.format(sec))
        return frontier
