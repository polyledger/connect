from django.contrib import admin

from .models import Trade


class TradeAdmin(admin.ModelAdmin):
    list_display = ('user', 'timestamp', 'trade_type', 'base_coin',
                    'counter_coin', 'pair', 'exchange', 'amount', 'cost_basis',
                    'fees', 'cost_basis_usd', 'fees_usd')

admin.site.register(Trade, TradeAdmin)
