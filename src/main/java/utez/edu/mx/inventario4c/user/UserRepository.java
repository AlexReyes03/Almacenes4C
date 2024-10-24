package utez.edu.mx.inventario4c.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    List<User> findAll();

    @Query(value = "SELECT * FROM user WHERE id_rol = :idRol", nativeQuery = true)
    List<User> findAllByIdRol(@Param("idRol") long idRol);

    @Query(value = "SELECT * FROM user WHERE id = :idUser", nativeQuery = true)
    User findById(@Param("idUser") long idUser);

    @Modifying
    @Query(value = "DELETE FROM user WHERE id = :idUser", nativeQuery = true)
    void deleteById(@Param("idUser") long idUser);
}

