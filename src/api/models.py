from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column

db = SQLAlchemy()


class User(db.Model):
    sent_reviews = relationship('UserReviewsDetails', foreign_keys='UserReviewsDetails.sender_user_id', backref='sender', lazy=True)
    received_reviews = relationship('UserReviewsDetails', foreign_keys='UserReviewsDetails.target_user_id', backref='receiver', lazy=True)


    
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



    
class TokenBlockedList(db.Model):
    __tablename__ = "tokenblockedlist"
    id: Mapped[int] = mapped_column(primary_key=True)
    jti: Mapped[str] = mapped_column(String(50), nullable=False)
