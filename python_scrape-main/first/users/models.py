from mongoengine import ListField, ReferenceField
from products.mongo_models import Product  # Make sure your product model is imported
from mongoengine import Document, StringField, EmailField

class User(Document):
    username = StringField(required=True, unique=True)
    email = EmailField(required=True, unique=True)
    password = StringField(required=True)
    wishlist = ListField(StringField())  # store product IDs as strings

    meta = {
        'collection': 'users',
        'db_alias': 'default'
    }

    @property
    def is_authenticated(self):
        return True
