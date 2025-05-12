from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

db = SQLAlchemy()



class User(db.Model):
    __tablename__ = "user"
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
      
    sent_reviews = relationship('UserReviewsDetails', foreign_keys='UserReviewsDetails.sender_user_id', backref='sender', lazy=True)
    received_reviews = relationship('UserReviewsDetails', foreign_keys='UserReviewsDetails.target_user_id', backref='receiver', lazy=True)
    favorites = relationship('Favorites', backref='user', lazy=True)
    michis= relationship('michis', backref='user', lazy=True)

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
      
      
 # User reviews model group   
class UserReviews(db.Model):
    __tablename__ = "userreviews"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('user.id'), nullable=False)
    rating: Mapped[int] = mapped_column(nullable=False)
    comment: Mapped[str] = mapped_column(String(300), nullable=True)

    def serialize(self):
        return {
            "id": self.id,
            "rating":self.rating,
            "comment": self.comment
        }
    
class UserReviewsDetails(db.Model):
    __tablename__ = "userreviewsdetails"
    id: Mapped[int] = mapped_column(primary_key=True)
    target_user_id: Mapped[int] = mapped_column(ForeignKey('user.id'), nullable=False)
    sender_user_id: Mapped[int] = mapped_column(ForeignKey('user.id'), nullable=False)
    review_id: Mapped[int] = mapped_column(ForeignKey('userreviews.id'), nullable=False)
    michi_id: Mapped[int] = mapped_column(ForeignKey('michis.id'), nullable=False)
    user_review = relationship('UserReviews', backref='details', lazy=True)
    

    def serialize(self):
        return { 
            "id":self.id,
            "sender_user_id":self.sender_user_id,
            "target_user_id":self.target_user_id,
            "michi_id":self.michi_id,
            "review": self.user_review.serialize() if self.user_review else None
        }
    



class Favorites(db.Model):
    __tablename__ = "favorites"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id:  Mapped[int] = mapped_column(ForeignKey('user.id'))
    michi_id: Mapped[int] = mapped_column(ForeignKey('michi.id'))

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "michi_id": self.michi_id
        }

      
class TokenBlockedList(db.Model):
    __tablename__ = "tokenblockedlist"
    id: Mapped[int] = mapped_column(primary_key=True)
    jti: Mapped[str] = mapped_column(String(50), nullable=False)
