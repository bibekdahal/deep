from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.views.generic import View, TemplateView
from django.http import JsonResponse, HttpResponse
from django.contrib.auth.decorators import login_required
from django.core.urlresolvers import reverse
from django.utils.decorators import method_decorator

from datetime import datetime
import json

from users.models import *
from leads.models import *
from entries.models import *
from entries.strippers import *


def get_lead_form_data():
    """ Get data required to construct "Add Lead" form.
    """

    data = {}
    data["sources"] = Source.objects.all()
    data["confidentialities"] = Lead.CONFIDENTIALITIES
    data["statuses"] = Lead.STATUSES
    data["users"] = User.objects.exclude(first_name="", last_name="")
    return data


class LeadsView(View):
    @method_decorator(login_required)
    def get(self, request, event):
        context = {}
        context["current_page"] = "leads"
        context["event"] = Event.objects.get(pk=event)
        UserProfile.set_last_event(request, context["event"])
        context["all_events"] = Event.objects.all()
        context.update(get_lead_form_data())
        return render(request, "leads/leads.html", context)

    @method_decorator(login_required)
    def post(self, request, event):
        print(request.POST)
        print(request.FILES)
        return redirect('leads:leads', event)


class SoSView(View):
    @method_decorator(login_required)
    def get(self, request, event):
        context = {}
        context["current_page"] = "sos"
        context["event"] = Event.objects.get(pk=event)
        UserProfile.set_last_event(request, context["event"])
        context["all_events"] = Event.objects.all()
        context.update(get_lead_form_data())
        return render(request, "leads/sos.html", context)


class AddSoS(View):
    @method_decorator(login_required)
    def get(self, request, event, lead_id, sos_id=None):
        context = {}
        context["current_page"] = "leads"
        context["event"] = Event.objects.get(pk=event)
        context["lead"] = Lead.objects.get(pk=lead_id)
        lead = context["lead"]

        # Find simplified version of the lead content.
        # Make sure to catch any exception.

        try:
            if lead.lead_type == "URL":
                doc = WebDocument(lead.url)

                if doc.html:
                    context["lead_simplified"] = \
                        HtmlStripper(doc.html).simplify()
                elif doc.pdf:
                    context["lead_simplified"] = \
                        PdfStripper(doc.pdf).simplify()

            elif lead.lead_type == "MAN":
                context["lead_simplified"] = lead.description

            elif lead.lead_type == "ATT":
                attachment = lead.attachment
                name, extension = os.path.splitext(attachment.upload.name)
                if extension == ".pdf":
                    context["lead_simplified"] = \
                        PdfStripper(attachment.upload).simplify()
                elif extension in [".html", ".htm"]:
                    context["lead_simplified"] = \
                        HtmlStripper(attachment.upload.read()).simplify()
        except:
            print("Error while simplifying")

        # Get fields options
        context["proximities"] = ProximityToSource.objects.all()
        context["units_of_analysis"] = UnitOfAnalysis.objects.all()
        context["data_collection_techniques"] = DataCollectionTechnique.objects.all()
        context["sampling_types"] = SamplingType.objects.all()
        context["quantifications"] = SectorQuantification.objects.all()
        context["analytical_values"] = SectorAnalyticalValue.objects.all()
        context["frequencies"] = AssessmentFrequency.objects.all()
        context["confidentialities"] = AssessmentConfidentiality.objects.all()
        context["statuses"] = AssessmentStatus.objects.all()

        if sos_id:
            context["sos"] = SurveyOfSurvey.objects.get(pk=sos_id)

        return render(request, "leads/add-sos.html", context)

    @method_decorator(login_required)
    def post(self, request, event, lead_id, sos_id=None):
        if sos_id:
            sos = SurveyOfSurvey.objects.get(pk=sos_id)
        else:
            sos = SurveyOfSurvey()

        sos.lead = Lead.objects.get(pk=lead_id)

        sos.title = request.POST["assesment-title"]
        sos.lead_organization = request.POST["lead-organization"]
        sos.partners = request.POST["other-assesment-partners"]
        if request.POST["assesment-frequency"] and request.POST["assesment-frequency"] != "":
            sos.frequency = AssessmentFrequency.objects.get(pk=request.POST["assesment-frequency"])
        if request.POST["assesment-status"] and request.POST["assesment-status"] != "":
            sos.status = AssessmentStatus.objects.get(pk=request.POST["assesment-status"])
        if request.POST["assesment-confidentiality"] and request.POST["assesment-confidentiality"] != "":
            sos.confidentiality = AssessmentConfidentiality.objects.get(pk=request.POST["assesment-confidentiality"])
        if request.POST["source-proximity"] and request.POST["source-proximity"] != "":
            sos.proximity_to_source = ProximityToSource.objects.get(pk=request.POST["source-proximity"])
        if request.POST["sampling-type"] and request.POST["sampling_type"] != "":
            sos.sampling_type = SamplingType.objects.get(pk=request.POST["sampling_type"])
        sos.created_by = request.user
        sos.sectors_covered = request.POST["sectors_covered"]
        sos.save()

        map_data = json.loads(request.POST["map_data"])
        temp = sos.map_selections.all()
        sos.map_selections.clear()
        temp.delete()
        for area in map_data:
            m = area.split(':')
            admin_level = AdminLevel.objects.get(
                country=Country.objects.get(code=m[0]),
                level=int(m[1])+1
            )
            try:
                selection = AdminLevelSelection.objects.get(
                    admin_level=admin_level, name=m[2]
                )
            except:
                selection = AdminLevelSelection(admin_level=admin_level,
                                                name=m[2])
                selection.save()

            sos.map_selections.add(selection)


        sos.unit_of_analysis.clear()
        if request.POST["analysis-unit"] and request.POST["analysis-unit"] != "null":
            pks = request.POST["analysis-unit"].split(",")
            for pk in pks:
                sos.unit_of_analysis.add(UnitOfAnalysis.objects.get(pk=pk))

        sos.start_data_collection.clear()
        if request.POST["start-of-field"] and request.POST["start-of-field"] != "null":
            pks = request.POST["start-of-field"].split(",")
            for pk in pks:
                sos.start_data_collection.add(DataCollectionTechnique.objects.get(pk=pk))

        sos.end_data_collection.clear()
        if request.POST["end-of-field"] and request.POST["end-of-field"] != "null":
            pks = request.POST["end-of-field"].split(",")
            for pk in pks:
                sos.end_data_collection.add(DataCollectionTechnique.objects.get(pk=pk))

        return redirect('leads:sos', event)

class AddLead(View):
    @method_decorator(login_required)
    def get(self, request, event, id=None):
        context = {}
        context["current_page"] = "leads"
        context["event"] = Event.objects.get(pk=event)
        UserProfile.set_last_event(request, context["event"])
        if id:
            context["lead"] = Lead.objects.get(pk=id)
        context.update(get_lead_form_data())

        # context["cancel_url"] = reverse("leads:leads", args=[event])
        return render(request, "leads/add-lead.html", context)

    @method_decorator(login_required)
    def post(self, request, event, id=None):

        error = ""

        # Get editing lead or create new lead.
        if id:
            lead = Lead.objects.get(pk=id)
        else:
            lead = Lead()

        lead.name = request.POST["name"]
        lead.event = Event.objects.get(pk=event)

        if "source" in request.POST and request.POST["source"] != "":
            lead.source = Source.objects.get(pk=request.POST["source"])
        else:
            lead.source = None

        lead.confidentiality = request.POST["confidentiality"]

        if "assigned-to" in request.POST and \
                request.POST["assigned-to"] != "":
            lead.assigned_to = User.objects.get(pk=request.POST["assigned-to"])
        else:
            lead.assigned_to = None

        if "publish-date" in request.POST and \
                request.POST["publish-date"] != "":
            lead.published_at = request.POST["publish-date"]
        else:
            lead.published_at = None

        lead.created_by = request.user

        if "lead-type" in request.POST and \
                request.POST["lead-type"] == "manual":
            lead.description = request.POST["description"]
            lead.lead_type = Lead.MANUAL_LEAD

        # TODO: Remove not condition.
        # Currently for the chrome plugin to work, the default type
        # when not provided is website.
        if "lead-type" not in request.POST or \
                request.POST["lead-type"] == "website":
            lead.url = request.POST["url"]
            lead.website = request.POST["website"]
            lead.lead_type = Lead.URL_LEAD

        if "lead-type" in request.POST and \
                request.POST["lead-type"] == "manual":
            lead.description = request.POST["description"]
            lead.lead_type = Lead.MANUAL_LEAD

        if "lead-type" in request.POST and \
                request.POST["lead-type"] == "attachment":
            lead.lead_type = Lead.ATTACHMENT_LEAD

        if "lead-type" in request.POST and \
                request.POST["lead-type"] == "survey-of-surveys":
            pass

        lead.save()

        if lead.lead_type == Lead.ATTACHMENT_LEAD:
            for file in request.FILES:
                Attachment.objects.filter(lead__pk=lead.pk).delete()
                attachment = Attachment()
                attachment.lead = lead
                attachment.upload = request.FILES[file]
                attachment.save()
                break

        if error != "":
            context = {}
            context["current_page"] = "leads"
            context["event"] = Event.objects.get(pk=event)
            UserProfile.set_last_event(request, context["event"])
            context["all_events"] = Event.objects.all()
            context["error"] = error
            return render(request, "leads/add-lead.html",
                          context)

        if "redirect-url" in request.POST:
            return JsonResponse({
                "url": reverse('entries:add', args=[event, lead.pk])
            })
        if "add-entry" in request.POST:
            return redirect('entries:add', event, lead.pk)

        return redirect("leads:leads", event=event)


class MarkProcessed(View):
    @method_decorator(login_required)
    def post(self, request, event):
        lead = Lead.objects.get(pk=request.POST["id"])
        lead.status = request.POST["status"]
        lead.save()
        return redirect('leads:leads', event=event)


class DeleteLead(View):
    @method_decorator(login_required)
    def post(self, request, event):
        lead = Lead.objects.get(pk=request.POST["id"])
        lead.delete()
        # lead.status = Lead.DELETED
        # lead.save()
        return redirect('leads:leads', event=event)
