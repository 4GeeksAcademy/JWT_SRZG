from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column

db = SQLAlchemy()


class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(40), nullable=False)
    lastname: Mapped[str] = mapped_column(String(40), nullable=False)
    dni: Mapped[str] = mapped_column(String(20), nullable=False)
    nickname: Mapped[str] = mapped_column(String(40), nullable=False)
    direction: Mapped[str] = mapped_column(String(40), nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    phone: Mapped[str] = mapped_column(String(20), nullable=False)
    password: Mapped[str] = mapped_column(String(200), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False, default=True)
    rol: Mapped[str] = mapped_column(String(40), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "lastname": self.lastname,
            "dni": self.dni,
            "nickname": self.nickname,
            "direction": self.direction,
            "email": self.email,
            "phone": self.phone,
            "rol": self.rol
            

            # do not serialize the password, its a security breach
        }

class Favorite(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    user:  Mapped[str] = mapped_column(String(40), nullable=False)
    michi: Mapped[str] = mapped_column(String(40), nullable=False)
    
    def serialize(self):
        return{
            "id": self.id,
            "user": self.user,
            "michi": self.michi
        }
        

class TokenBlockedList(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    jti: Mapped[str] = mapped_column(String(50), nullable=False)
