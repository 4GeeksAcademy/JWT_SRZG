from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column

db = SQLAlchemy()


class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(200), nullable=False)
    fullname: Mapped[str] = mapped_column(String(200), nullable=False)
    is_active: Mapped[bool] = mapped_column(
        Boolean(), nullable=False, default=True)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "fullname": self.fullname,
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
    user_review = relationship('UserReviews', backref='details', lazy=True)

    def serialize(self):
        return { 
            "id":self.id,
            "sender_user_id":self.sender_user_id,
            "target_user_id":self.target_user_id,
            "review": self.user_review.serialize() if self.user_review else None
        }



    
class TokenBlockedList(db.Model):
    __tablename__ = "tokenblockedlist"
    id: Mapped[int] = mapped_column(primary_key=True)
    jti: Mapped[str] = mapped_column(String(50), nullable=False)
