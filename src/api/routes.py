"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""


from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Favorites, TokenBlockedList, UserReviews, UserReviewsDetails
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
    new_user = User(
        name=body["name"],
        lastname=body["lastname"],
        dni=body["dni"],
        nickname=body["nickname"],
        direction=body["direction"],
        email=body["email"], 
        phone=body["phone"], 
        )
    # Password
    hashed_password = bcrypt.generate_password_hash(
        body["password"]).decode("utf-8")
    new_user.password = hashed_password
    db.session.add(new_user)
    db.session.commit()
    return jsonify(new_user.serialize()), 201
# faltaria desarrolar mas para que el email tenga formato valido, la contra cumpla con requisitos para mayor seguridad, 
#el deni dni y telefono tengan formatos esperados y que los campos obligatorios enten presentes en el body.
# falta manejo de errores por si el usuario se registra con un email o nick name que ya esxite


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


@api.route("/private", methods=["GET"])
@jwt_required()
def private():
    actually_user = get_jwt_identity()
    return jsonify(logged_in_as=actually_user), 200


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
    return jsonify({"msg": "User Logged Out"}), 200

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

#User Routes
@api.route("/user/<int:user_id>", methods=["PUT"])
@jwt_required()
def update_user(user_id):
    body = request.get_json()
    if not body:
        return jsonify({"msg": "Debes proporcionar informacion para actulizar el usuario" }), 400
    
    current_user_id = get_jwt_identity()
    if current_user_id != user_id:
        return jsonify({"msg": "No tienes permiso para actualizar este usuario"}), 403

    current_user = User.query.get(current_user_id)
    if not current_user:
        return jsonify({"msg": "Usuario no encontrado"}), 404
    
    current_user.name = body.get("name", current_user.name)
    current_user.lastname = body.get("lastname", current_user.lastname)
    current_user.dni = body.get("dni", current_user.dni)
    current_user.nickname = body.get("nickname", current_user.nickname)
    current_user.direction = body.get("direction", current_user.direction)
    current_user.email = body.get("email", current_user.email)
    current_user.phone = body.get("phone", current_user.phone)
    current_user.password = body.get("password", current_user.password)
    current_user.name = body.get("name", current_user.name)



    db.session.add(current_user)
    db.session.commit()
    return jsonify(current_user.serialize()), 201


@app.route('/user/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": f"User with id {user_id} has been deleted."}), 200


@app.route('/favorites/<int:michi_id', methods=['POST'])
@jwt_required()
def add_favorite(michi_id):
    current_user_email = get_jwt_identity() # no se si debo ponerlo con user_id o user_email
    user = User.query.filter_by(email=current_user_email).first()
    michi = Michi.query.get(michi_id)

    if not user:
        return jsonify({"msg": "User not found"}), 404
    if not michi:
        return jsonify(["msg": "Michi not found"]), 404
    
    if Favorites.query.filter_by(user_id=user.id, michi_id=michi.id).first():
        return jsonify({"msg": "This michi is already on your favorites list"}), 409
    
    new_favorite = Favorites(user_id=user.id, michi_id=michi.id)
    db.session.add(new_favorite)
    db.session.commit()
    return jsonify({"Michi has been added"}), 201


@app.route('/favorites/<int:michi_id>', methods={'DELETE'})
@jwt_required()
def delete_favorite(michi_id):
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()

    if not user:
        return jsonify({"msg": "User not found"}), 404
    
    favorite_to_delete = Favorites.query.filter_by(user_id=user.id, michi_id=michi.id) 
    if not favorite_to_delete:
        return jsonify({"msg": "This michi is not your favorites"}), 404
    
    db.session.delete(favorite_to_delete)
    db.session.commit()
    return jsonify({"msg": f"Michi with id {michi_id} has been delete"})
  
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
