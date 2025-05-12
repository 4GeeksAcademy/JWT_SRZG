from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, TokenBlockedList
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


@api.route("/private", methods=["GET"])
@jwt_required()
def private():
   actually_user = get_jwt_identity()
   return jsonify(logged_in_as=actually_user),200


























































































































@api.route("/cats", methods=["POST"])
def create_cat():
    body = request.get_json()

    new_cat = CatUser(
        name=body["name"],
        breed=body.get("breed"),
        age=body.get("age"),
        weight=body.get("weight"),
        description=body.get("description"),
        color=body.get("color"),
        sex=body.get("sex"),
        is_active=body.get("is_active", True)
    )

    db.session.add(new_cat)
    db.session.commit()
    return jsonify(new_cat.serialize()), 201

@api.route("/cats/<int:id>", methods=["DELETE"])
def delete_cat(id):
    cat = db.session.get(CatUser, id)
    if cat is None:
        return jsonify({"error": "Cat not found"}), 404

    db.session.delete(cat)
    db.session.commit()
    return jsonify({"message": "Cat deleted"}), 200


@api.route("/cats/<int:id>", methods=["PUT"])
def update_cat(id):
    body = request.get_json()
    cat = db.session.get(CatUser, id)
    if cat is None:
        return jsonify({"error": "Cat not found"}), 404

    cat.name = body.get("name", cat.name)
    cat.breed = body.get("breed", cat.breed)
    cat.age = body.get("age", cat.age)
    cat.weight = body.get("weight", cat.weight)
    cat.description = body.get("description", cat.description)
    cat.color = body.get("color", cat.color)
    cat.sex = body.get("sex", cat.sex)
    cat.is_active = body.get("is_active", cat.is_active)

    db.session.commit()
    return jsonify(cat.serialize()), 200


@api.route("/cat-photos", methods=["POST"])
def create_cat_photo():
    body = request.get_json()

    new_photo = CatPhoto(
        foto1=body.get("foto1"),
        foto2=body.get("foto2"),
        foto3=body.get("foto3"),
        foto4=body.get("foto4"),
        foto5=body.get("foto5"),
        cat_id=body["cat_id"],
        user_id=body.get("user_id")
    )

    db.session.add(new_photo)
    db.session.commit()
    return jsonify(new_photo.serialize()), 201


@api.route("/cat-photos/<int:id>", methods=["DELETE"])
def delete_cat_photo(id):
    photo = db.session.get(CatPhoto, id)
    if photo is None:
        return jsonify({"error": "Photo not found"}), 404

    db.session.delete(photo)
    db.session.commit()
    return jsonify({"message": "Photo entry deleted"}), 200
