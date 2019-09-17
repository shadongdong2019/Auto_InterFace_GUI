from django.conf.urls import url
from django.urls import path
from django.views.static import serve

from Auto_InterFace_GUI import settings
from . import views

import upload_case
app_name = 'upload_case'
urlpatterns = [
    path('',views.index),
    url(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
    url(r'^static/(?P<path>.*)$', serve, {'document_root': settings.STATIC_ROOT}),
]
