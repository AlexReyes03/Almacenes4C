package utez.edu.mx.inventario4c.modules.storage;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StorageRepository extends JpaRepository<Storage, Long> {
    // Traer todos los almacenes
    List<Storage> findAll();

    // Traer almacén por ID
    Storage findById(long idStorage);

    // Guardar/Actualizar almacén
    Storage save(Storage storage);

    // Eliminar almacén
    @Modifying
    @Query(value = "DELETE FROM storage WHERE id = ?", nativeQuery = true)
    void deleteById(@Param("idStorage") long idStorage);
}
