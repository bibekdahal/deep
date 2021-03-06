from django.contrib.auth.models import User
from django.db import models

from leads.models import Event, Country


class ActivityLog(models.Model):
    user = models.ForeignKey(User)
    group = models.ForeignKey('usergroup.UserGroup', default=None, null=True, blank=True)
    event = models.ForeignKey('leads.Event', default=None, null=True, blank=True)
    activity = models.TextField(default='{}')
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.user) + ' at ' + str(self.timestamp)

    class Meta:
        ordering = ['-timestamp']


class UserProfile(models.Model):
    """ User Profile Model

    This acts as extension to the Django User model
    supporting extra user data not already supported by
    Django's User.
    """

    photo = models.FileField(upload_to="group-avatar/", null=True, blank=True,
                             default=None)
    user = models.OneToOneField(User, primary_key=True)
    hid = models.TextField(default=None, null=True, blank=True)
    organization = models.CharField(max_length=150)
    country = models.ForeignKey(Country, default=None, null=True, blank=True,
                                on_delete=models.SET_NULL)
    last_event = models.ForeignKey(Event, default=None, null=True, blank=True,
                                   on_delete=models.SET_NULL)

    def __str__(self):
        return str(self.user)

    @staticmethod
    def set_last_event(request, event):
        try:
            profile = UserProfile.objects.get(user__pk=request.user.pk)
            profile.last_event = event
            profile.save()
        except:
            pass

    @staticmethod
    def get_last_event(request):
        return UserProfile.objects.get(user__pk=request.user.pk).last_event

    class Meta:
        verbose_name_plural = "User Profiles"
