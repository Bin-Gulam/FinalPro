from django_filters import rest_framework as filters
from .models import Applicant

class ApplicantFilter(filters.FilterSet):
    name = filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = Applicant
        fields = ['name']
