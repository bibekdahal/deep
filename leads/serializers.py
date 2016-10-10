from django.contrib.auth.models import User
from django.conf import settings
from rest_framework import serializers

import os
import json

from leads.models import *


class SourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Source
        fields = ('source',)


class LeadSerializer(serializers.ModelSerializer):
    """ Lead serializer used by the REST api
    """

    attachment = serializers.SerializerMethodField()
    assigned_to_name = serializers.SerializerMethodField()
    created_by_name = serializers.SerializerMethodField()

    class Meta:
        model = Lead
        fields = ('id', 'name', 'source', 'assigned_to',
                  'published_at', 'confidentiality', 'status', 'description',
                  'url', 'website', 'created_at', 'created_by', 'attachment',
                  'assigned_to_name', 'created_by_name', 'event', 'lead_type')

        # TODO: Automatically set created_by.

    def get_attachment(self, lead):
        try:
            a = lead.attachment
            return [
                    os.path.basename(a.upload.name),
                    a.upload.url
                    ]
        except:
            return None

    def get_assigned_to_name(self, lead):
        if lead.assigned_to:
            return lead.assigned_to.get_full_name()
        else:
            return ""

    def get_created_by_name(self, lead):
        if lead.created_by:
            return lead.created_by.get_full_name()
        else:
            return ""


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ('id', 'name',)


class SosSerializer(serializers.ModelSerializer):
    countries = serializers.SerializerMethodField()
    areas = serializers.SerializerMethodField()
    areas_summary = serializers.SerializerMethodField()
    created_by_name = serializers.SerializerMethodField()
    lead_id = serializers.SerializerMethodField()
    sectors_covered = serializers.SerializerMethodField()
    affected_groups = serializers.SerializerMethodField()
    unit_of_analysis = serializers.SerializerMethodField()
    data_collection_technique = serializers.SerializerMethodField()

    proximity_to_source = serializers.CharField(source='proximity_to_source.name', read_only=True)
    start_data_collection = serializers.CharField(source='start_data_collection.name', read_only=True)
    end_data_collection = serializers.CharField(source='end_data_collection.name', read_only=True)
    sampling_type = serializers.CharField(source='sampling_type.name', read_only=True)
    frequency = serializers.CharField(source='frequency.name', read_only=True)
    status = serializers.CharField(source='status.name', read_only=True)
    confidentiality = serializers.CharField(source='confidentiality.name', read_only=True)

    class Meta:
        model = SurveyOfSurvey
        depth = 1
        fields = ('id', 'created_at', 'created_by_name',
                  'title', 'lead_organization', 'partners',
                  'proximity_to_source', 'unit_of_analysis', 'start_data_collection',
                  'end_data_collection', 'data_collection_technique',
                  'sectors_covered',
                  'sampling_type', 'frequency', 'status', 'confidentiality',
                  'countries', 'areas', 'areas_summary', 'sectors_covered', 'lead_id',
                  'affected_groups')


    def get_countries(self, sos):
        return {s.admin_level.country.pk: s.admin_level.country.name for s in sos.map_selections.all()}

    def get_areas(self, sos):
        data = {}
        for s in sos.map_selections.all():
            if s.admin_level.name not in data:
                data[s.admin_level.name] = {"country": s.admin_level.country.pk, "locations": []}
            data[s.admin_level.name]["locations"].append(s.name)
        return data

    def get_country_names(self, sos):
        cs = [s.admin_level.country.name for s in sos.map_selections.all()]
        return list(set(cs))

    def get_areas_summary(self, sos):
        return ", ".join([s.name for s in sos.map_selections.all()] + self.get_country_names(sos))

    def get_created_by_name(self, sos):
        return sos.created_by.get_full_name()

    def get_lead_id(self, sos):
        return sos.lead.pk

    def get_sectors_covered(self, sos):
        scs = json.loads(sos.sectors_covered)
        data = {}
        for sc in scs:
            if sc["quantification"] or sc["analytical_value"]:
                data[sc["title"]] = {
                    "quantification": sc["quantification"],
                    "analytical_value": sc["analytical_value"]
                }
        return data

        # data = []
        # for sc in scs:
        #     if sc["quantification"] or sc["analytical_value"]:
        #         data.append(sc["title"])

        # return ", ".join(data)

    def get_affected_groups(self, sos):
        return json.loads(sos.affected_groups)
        # return ", ".join(json.loads(sos.affected_groups))

    def get_unit_of_analysis(self, sos):
        return [u.name for u in sos.unit_of_analysis.all()]

    def get_data_collection_technique(self, sos):
        return [d.name for d in sos.data_collection_technique.all()]
