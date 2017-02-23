from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.views.generic import View, TemplateView
from django.contrib.auth.decorators import login_required
from django.core.urlresolvers import reverse
from django.utils.decorators import method_decorator

from users.models import *
from usergroup.models import *
from deep.json_utils import *
from users.log import *


class UserGroupPanelView(View):
    @method_decorator(login_required)
    def get(self, request, group_slug):
        context = {}
        context['usergroup'] = UserGroup.objects.get(slug=group_slug)
        context['activities'] = ActivityLog.objects.filter(user__usergroup__slug=group_slug)
        return render(request, 'usergroup/user-group-panel.html', context)

    @method_decorator(login_required)
    def post(self, request, group_slug):
        data_in = get_json_request(request)
        if data_in:
            return self.handle_json_request(request, data_in, group_slug)
        else:
            return redirect('usergroup', args=[group_slug])

    def handle_json_request(self, original_request, request, group_slug):
        try:
            group = UserGroup.objects.get(slug=group_slug)
        except:
            return JsonError('Cannot find user group')

        response = {}

        # TODO check if user has permission for whatever request

        # Remove members
        if request['request'] == 'removeMembers':
            response['removedMembers'] = []
            for pk in request['members']:
                try:
                    user = User.objects.get(pk=pk)
                    group.members.remove(user)
                    response['removedMembers'].append(pk)

                    RemovalActivity().set_target(
                        'member', user.pk, user.get_full_name(),
                        reverse('user_profile', args=[pk])
                    ).log_for(original_request.user, group=group)
                except:
                    pass

        # Add members
        elif request['request'] == 'addMembers':
            response['addedMembers'] = []
            for pk in request['users']:
                try:
                    user = User.objects.get(pk=pk)
                    group.members.add(user)
                    response['addedMembers'].append(pk)

                    AdditionActivity().set_target(
                        'member', user.pk, user.get_full_name(),
                        reverse('user_profile', args=[pk])
                    ).log_for(original_request.user, group=group)
                except:
                    pass

        return JsonResult(data=response)
