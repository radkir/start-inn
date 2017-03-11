from rest_framework.urlpatterns import format_suffix_patterns
from app import views
from django.conf.urls import url


urlpatterns = [
    url(r'^$', views.home, name='home'),
    url(r'^data$', views.data, name='data')
]

urlpatterns = format_suffix_patterns(urlpatterns)
