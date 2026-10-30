from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from django.template.context_processors import request
from rest_framework.response import Response
from openai import OpenAI 
import os
import json
from cars.models import Car
# Create your views here.
client = OpenAI(
    api_key=os.getenv('GROK_API_KEY'),
    base_url="https://api.groq.com/openai/v1"
)



@csrf_exempt
@api_view(['POST'])
def askbot(request):
    question = request.data.get('question')
    if not question:
        Response({'message':'question not found'},status=404)
    cars = Car.objects.values()
    response = client.responses.create(
         model="openai/gpt-oss-20b",
        input=[ {
            "role": "system",
            "content": (
                "You are a Car Show Assistant. "
                "Answer questions using only the supplied car database. "
                "Do not invent car details, prices, specifications, "
                "or availability. If information is missing, say so."
            )
        },
        {
            "role": "user",
            "content": f"""
                Car Database:
                {json.dumps(cars, default=str)}

                Question:
                {question}
            """
        }]
    )
    return Response({'answer':response.output_text},status=200)