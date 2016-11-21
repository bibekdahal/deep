from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.views.generic import View, TemplateView
from django.contrib.auth.decorators import login_required
from django.contrib.admin.views.decorators import staff_member_required
from django.utils.decorators import method_decorator
from django.core.urlresolvers import reverse

from leads.models import *
from entries.models import *


class CrisisPanelView(View):
    @method_decorator(login_required)
    def get(self, request):
        context = {}
        context['current_page'] = 'crisis-panel'
        return render(request, "custom_admin/crisis-panel.html", context)