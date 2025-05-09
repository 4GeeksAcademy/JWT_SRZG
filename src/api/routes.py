"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, TokenBlockedList, UserReviews, UserReviewsDetails
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity, get_jwt
from flask_jwt_extended import jwt_required


api = Blueprint('api', __name__)
app = Flask(__name__)
bcrypt = Bcrypt(app)

# Allow CORS requests to this API
CORS(api)


@api.route("/register", methods=["POST"])
def register_user():
    body = request.get_json()
    new_user = User(email=body["email"], fullname=body["fullname"])
    # Password
    hashed_password = bcrypt.generate_password_hash(
        body["password"]).decode("utf-8")
    new_user.password = hashed_password
    db.session.add(new_user)
    db.session.commit()
    return jsonify(new_user.serialize()), 201


@api.route("/login", methods=["POST"])
def login_user():
    body = request.get_json()
    user = User.query.filter_by(email=body["email"]).first()
    if user is None:
        return jsonify({"msg": "Mail not found"}), 401
    is_valid_password = bcrypt.check_password_hash(
        user.password, body["password"])
    if not is_valid_password:
        return jsonify({"msg": "Invalid password"}), 401
    payload = {
        "admin": False,
        "permisions": 123123
    }
    token = create_access_token(identity=str(
        user.id), additional_claims=payload)
    return jsonify({"token": token}), 200


@api.route("/userinfo", methods=["GET"])
@jwt_required()
def user_info():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    payload = get_jwt()
    return jsonify({
        "user": user.serialize(),
        "payload": payload
    })


@api.route("/logout", methods=["POST"])
@jwt_required()
def user_logout():
    payload = get_jwt()
    token_blocked = TokenBlockedList(jti=payload["jti"])
    db.session.add(token_blocked)
    db.session.commit()
    return jsonify({"msg": "User Logged Out"}),200

# Review Routes
@api.route("/user/<int:id>/reviews", methods=["GET"])
@jwt_required()
def get_received_reviews(id):
    reviews_details = UserReviewsDetails.query.filter_by(target_user_id=id).all()
    return jsonify([review.serialize() for review in reviews_details]), 200

@api.route("/user/sent-reviews", methods=["GET"])
@jwt_required()
def get_sent_reviews():
    user_id = get_jwt_identity()
    reviews_details = UserReviewsDetails.query.filter_by(sender_user_id=user_id).all()
    return jsonify([review.serialize() for review in reviews_details]), 200

@api.route("/user/<int:target_user_id>/<int:michi_id>/review", methods=["POST"])
@jwt_required()
def add_review(target_user_id, michi_id):
    body = request.get_json()
    sender_user_id = get_jwt_identity()
    if sender_user_id == target_user_id:
        return jsonify({"msg":"You cannot rate yourself"}), 409
    existing_review = UserReviewsDetails.query.filter_by(sender_user_id=sender_user_id, target_user_id=target_user_id, michi_id=michi_id).first()
    if existing_review:
        return jsonify({"msg":"You already reviewed this michi"}), 409
    
    new_user_review = UserReviews(user_id=sender_user_id, rating=body["rating"],comment=body.get("comment"))
    db.session.add(new_user_review)
    db.session.commit()

    new_review_relationship = UserReviewsDetails(sender_user_id=sender_user_id, target_user_id=target_user_id, michi_id=michi_id, review_id=new_user_review.id)
    db.session.add(new_review_relationship)
    db.session.commit()

    return jsonify(new_review_relationship.serialize()), 201


#Private Routes
@api.route("/private", methods=["GET"])
@jwt_required()
def private():
   actually_user = get_jwt_identity()
   return jsonify(logged_in_as=actually_user),200

