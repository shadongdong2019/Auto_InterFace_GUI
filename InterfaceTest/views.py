from django.shortcuts import render, render_to_response


# Create your views here.
def show_report(request):
    return render_to_response("manage20190916093940.html")