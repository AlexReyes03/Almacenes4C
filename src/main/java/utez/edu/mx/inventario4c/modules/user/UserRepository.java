package utez.edu.mx.inventario4c.modules.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Traer todos los usuarios
    List<User> findAll();

    // Traer todos los usuarios por rol
    @Query(value = "SELECT * FROM user WHERE id_rol = :idRol", nativeQuery = true)
    List<User> findAllByIdRol(@Param("idRol") long idRol);

    // Traer un usuario por id
    User findById(long idUser);

    // Guardar/Actualizar usuario
    User save(User user);

    // Eliminar usuario
    @Modifying
    @Query(value = "DELETE FROM user WHERE id = :idUser", nativeQuery = true)
    void deleteById(@Param("idUser") long idUser);

    // Buscar usuario por usuario/correo y contraseña
    @Query(value = "SELECT * FROM user " +
            "WHERE password = :password " +
            "AND (email = :username OR username = :username);",
            nativeQuery = true)
    User findByPasswordAndEmailOrUsername(
            @Param("password") String password,
            @Param("username") String username
    );

    // Buscar usuario por nombre de usuario
    User findByUsername(String username);
}