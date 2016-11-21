from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator

from leads.models import *
from entries.models import *


MONTHS = (
    (1, "January"),
    (2, "February"),
    (3, "March"),
    (4, "April"),
    (5, "May"),
    (6, "June"),
    (7, "July"),
    (8, "August"),
    (9, "September"),
    (10, "October"),
    (11, "November"),
    (12, "December"),
)


class HumanProfileField(models.Model):
    name = models.CharField(max_length=100)
    parent = models.ForeignKey('HumanProfileField', default=None, null=True, blank=True)

    def __str__(self):
        if self.parent:
            return self.name + " [" + self.parent.name + "]"
        return self.name

    class Meta:
        verbose_name_plural = "Humanitarian Profile Fields"


class PeopleInNeedField(models.Model):
    name = models.CharField(max_length=100)
    parent = models.ForeignKey('PeopleInNeedField', default=None, null=True, blank=True)

    def __str__(self):
        if self.parent:
            return self.name + " [" + self.parent.name + "]"
        return self.name

    class Meta:
        verbose_name_plural = "PIN Fields"



class HumanAccessField(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Humanitarian Access Fields"


class HumanAccessPinField(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Humanitarian Access PIN Fields"


class WeeklyReport(models.Model):
    data = models.TextField(default="{}")
    start_date = models.DateField()  # start date for the week

    event = models.ForeignKey(Event)
    country = models.ForeignKey(Country)

    last_edited_by = models.ForeignKey(User)
    last_edtied_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "Week at " + str(self.start_date)

    class Meta:
        ordering = [ '-start_date' ]
        verbose_name_plural = "Weekly Reports"

class DisasterType(models.Model):
    name = models.CharField(max_length=200)
    parent = models.ForeignKey('DisasterType', null=True, blank=True, default=None)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Disaster Types"

class ReportStatus(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Report Statuses"


class CategoryTimeline(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Category Timelines"

