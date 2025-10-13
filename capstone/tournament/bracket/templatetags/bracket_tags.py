from django import template

register = template.Library()

@register.filter
def filter_by_stage(queryset, stage):
    return queryset.filter(stage=stage)