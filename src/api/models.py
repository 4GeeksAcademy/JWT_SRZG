

from sqlalchemy import String, Integer, Float, Boolean, Text, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from api.models import db
import enum

class CatSex(enum.Enum):
    male = "male"
    female = "female"

class CatUser(db.Model):
    __tablename__ = "cat_user"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    breed: Mapped[str] = mapped_column(String(100), nullable=True)
    age: Mapped[int] = mapped_column(Integer, nullable=True)
    weight: Mapped[float] = mapped_column(Float, nullable=True)  
    description: Mapped[str] = mapped_column(String(255), nullable=True)
    color: Mapped[str] = mapped_column(String(100), nullable=True)
    sex: Mapped[str] = mapped_column(String(10), nullable=True)  
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    

    photos: Mapped[list["CatPhoto"]] = relationship("CatPhoto", back_populates="cat", cascade="all, delete-orphan")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "age": self.age,
            "color": self.color,
            "sex": self.sex,
            "is_active": self.is_active,
            "photos": [photo.serialize() for photo in self.photos]
        }
class CatPhoto(db.Model):
    __tablename__ = "cat_photo"

    id: Mapped[int] = mapped_column(primary_key=True)
    foto1: Mapped[str] = mapped_column(Text, nullable=True)
    foto2: Mapped[str] = mapped_column(Text, nullable=True)
    foto3: Mapped[str] = mapped_column(Text, nullable=True)
    foto4: Mapped[str] = mapped_column(Text, nullable=True)
    foto5: Mapped[str] = mapped_column(Text, nullable=True)
    
    cat_id: Mapped[int] = mapped_column(ForeignKey("cat_user.id"), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=True)

    # Relaciones
    cat: Mapped["CatUser"] = relationship("CatUser", back_populates="photos")
    user: Mapped["User"] = relationship("User")

    def serialize(self):
        return {
            "id": self.id,
            "foto1": self.foto1,
            "foto2": self.foto2,
            "foto3": self.foto3,
            "foto4": self.foto4,
            "foto5": self.foto5,
            "cat_id": self.cat_id,
            "user_id": self.user_id
        }



















































































































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
