package utez.edu.mx.inventario4c.modules.storage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.inventario4c.modules.article.Article;
import utez.edu.mx.inventario4c.modules.article.ArticleRepository;
import utez.edu.mx.inventario4c.modules.category.Category;
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
        List<Article> articles = s.getArticles() != null ? s.getArticles() : new ArrayList<>();

        return new StorageDTO(
                s.getId(),
                s.getName(),
                s.getUser() != null ? s.getUser() : null,  // Manejar null
                s.getCategory() != null ? s.getCategory() : null,  // Manejar null
                articles
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

            // Obtener los artículos asociados al almacén
            List<Article> articles = found.getArticles();

            // Si los artículos existen, agregarlos al DTO
            dto = new StorageDTO(
                    found.getId(),
                    found.getName(),
                    found.getUser() != null ? found.getUser() : null,  // Manejar null
                    found.getCategory() != null ? found.getCategory() : null,  // Manejar null
                    articles != null ? articles : new ArrayList<>()  // Asegurarnos de que la lista no sea null
            );

            return customResponseEntity.getOkResponse(message, "OK", 200, dto);
        }
    }


    // Guardar almacén
    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<?> save(Storage storage) {
        try {
            storage.setArticles(new ArrayList<>()); // Inicia con una lista vacía
            storageRepository.save(storage);

            return customResponseEntity.getOkResponse(
                    "Almacén creado con éxito",
                    "CREATED",
                    201,
                    null
            );
        } catch (Exception e) {
            e.printStackTrace();
            return customResponseEntity.get400Response();
        }
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<?> addArticlesToStorage(long storageId, List<Long> articleIds) {
        try {
            // Buscar almacén por ID
            Storage foundStorage = storageRepository.findById(storageId);
            if (foundStorage == null) {
                return customResponseEntity.get404Response();
            }

            // Validar que los artículos tengan la misma categoría que el almacén
            Category storageCategory = foundStorage.getCategory();
            List<Article> articlesToAdd = new ArrayList<>();

            for (long articleId : articleIds) {
                Article foundArticle = articleRepository.findById(articleId);
                if (foundArticle != null) {
                    if (!foundArticle.getCategory().equals(storageCategory)) {
                        return customResponseEntity.get400Response();
                    }
                    foundStorage.addArticle(foundArticle); // Relación bidireccional
                    articlesToAdd.add(foundArticle);
                }
            }

            storageRepository.save(foundStorage); // Persistir cambios

            return customResponseEntity.getOkResponse(
                    "Artículos añadidos con éxito",
                    "OK",
                    200,
                    null
            );
        } catch (Exception e) {
            e.printStackTrace();
            return customResponseEntity.get400Response();
        }
    }


    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<?> removeArticlesFromStorage(long storageId, List<Long> articleIds) {
        try {
            // Buscar almacén por ID
            Storage foundStorage = storageRepository.findById(storageId);
            if (foundStorage == null) {
                return customResponseEntity.get404Response();
            }

            // Buscar los artículos por ID y quitar la relación
            List<Article> articlesToRemove = new ArrayList<>();
            for (long articleId : articleIds) {
                Article foundArticle = articleRepository.findById(articleId);
                if (foundArticle != null) {
                    foundStorage.removeArticle(foundArticle); // Quitar artículo del almacén
                    articlesToRemove.add(foundArticle);
                }
            }

            storageRepository.save(foundStorage); // Persistir cambios

            return customResponseEntity.getOkResponse(
                    "Artículos eliminados con éxito",
                    "OK",
                    200,
                    null
            );
        } catch (Exception e) {
            e.printStackTrace();
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
