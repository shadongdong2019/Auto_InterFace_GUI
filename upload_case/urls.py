from django.conf.urls import url
from django.urls import path, re_path
from django.views.static import serve

from Auto_InterFace_GUI import settings
from . import views

import upload_case
app_name = 'upload_case'
urlpatterns = [
    path('',views.index),
    path('index/',views.index),
    re_path('^file_download', views.file_down, name="file_down")

]
