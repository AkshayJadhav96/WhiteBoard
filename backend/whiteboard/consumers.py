from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import Drawing
import json

class WhiteboardConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"whiteboard_{self.room_name}"

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

        history = await self.get_drwaing_history(self.room_name)
        await self.send(text_data=json.dumps({
            "type":"init",
            "data":history
        }))

    async def disconnect(self, _):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        await self.save_drawing(self.room_name,data)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "broadcast_draw",
                "message": text_data,
            },
        )

    async def broadcast_draw(self, event):
        await self.send(text_data=event["message"])

    @sync_to_async
    def save_drawing(self,room_name,data):
        Drawing.objects.create(
            room_name= room_name,
            x0 = data["x0"],
            y0 = data["y0"],
            x1 = data["x1"],
            y1 = data["y1"]
        )
    
    @sync_to_async 
    def get_drwaing_history(self,room_name):
        drawings = Drawing.objects.filter(room_name=room_name).order_by("timestamp")
        return [
            {
                "x0": d.x0, "y0": d.y0,
                "x1": d.x1, "y1": d.y1
            } for d in drawings
        ]
    