package utez.edu.mx.inventario4c.modules.storage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.inventario4c.modules.article.Article;
import utez.edu.mx.inventario4c.modules.article.ArticleRepository;
import utez.edu.mx.inventario4c.modules.storage.DTO.StorageDTO;
import utez.edu.mx.inventario4c.utils.CustomResponseEntity;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Service
public class StorageService {

    // INYECCION DE DEPENDENCIAS
    @Autowired
    private StorageRepository storageRepository;

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private CustomResponseEntity customResponseEntity;

    // MÉTODOS DEL SERVICIO
    // Transformar almacén a DTO
    public StorageDTO transformStorageToDTO(Storage s) {
        // Manejar el caso en el que la lista de artículos sea null y obtener los IDs como Long
        List<Long> articleIds = s.getArticles() != null
                ? s.getArticles().stream()
                .map(article -> (long) article.getId())  // Convertir a Long
                .toList()  // Convertir a lista
                : new ArrayList<>();  // Lista vacía si es null

        return new StorageDTO(
                s.getId(),
                s.getName(),
                s.getUser() != null ? s.getUser().getId() : 0,  // Manejar null
                s.getCategory() != null ? s.getCategory().getId() : 0,  // Manejar null
                articleIds
        );
    }

    // Traer todos los almacenes
    @Transactional(readOnly = true)
    public ResponseEntity<?> findAll() {
        List<StorageDTO> list = new ArrayList<>();
        String message = "";
        if (storageRepository.findAll().isEmpty()) {
            message = "Aún no hay registros";
        } else {
            message = "Operación exitosa";
            for (Storage s : storageRepository.findAll()) {
                list.add(transformStorageToDTO(s));
            }
        }
        return customResponseEntity.getOkResponse(message, "OK", 200, list);
    }

    // Traer almacén por ID
    @Transactional(readOnly = true)
    public ResponseEntity<?> findById(long idStorage) {
        StorageDTO dto = null;
        Storage found = storageRepository.findById(idStorage);
        String message = "";
        if (found == null) {
            return customResponseEntity.get404Response();
        } else {
            message = "Operación exitosa";
            dto = transformStorageToDTO(found);

            return customResponseEntity.getOkResponse(message, "OK", 200, dto);
        }
    }

    // Guardar almacén
    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<?> save(Storage storage) {
        try {
            storageRepository.save(storage);
            if (storage.getArticles() != null) {
                for (Article article : storage.getArticles()) {
                    if (article.getOnStock() > 0) {
                        storageRepository.save(storage);
                        articleRepository.save(article);
                    }
                }
            }
            return customResponseEntity.getOkResponse(
                    "Registro exitoso",
                    "CREATED",
                    201,
                    null
            );
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println(e.getMessage());
            return customResponseEntity.get400Response();
        }
    }

    // Actualizar almacén
    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<?> update(Storage storage) {
        Storage found = storageRepository.findById(storage.getId());
        if (found == null) {
            return customResponseEntity.get400Response();
        } else {
            try {
                storageRepository.save(storage);
                return customResponseEntity.getOkResponse(
                        "Actualización exitosa",
                        "OK",
                        200,
                        null
                );
            } catch (Exception e) {
                e.printStackTrace();
                System.out.println(e.getMessage());
                return customResponseEntity.get400Response();
            }
        }
    }

    // Eliminar almacén por ID
    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<?> deleteById(Storage storage) {
        if (storageRepository.findById(storage.getId()) == null) {
            return customResponseEntity.get404Response();
        } else {
            try {
                storageRepository.deleteById(storage.getId());
                return customResponseEntity.getOkResponse(
                        "Eliminaciòn exitosa",
                        "OK",
                        200,
                        null
                );
            } catch (Exception e) {
                e.printStackTrace();
                System.out.println(e.getMessage());
                return customResponseEntity.get400Response();
            }
        }
    }
}
