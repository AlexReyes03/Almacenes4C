package utez.edu.mx.inventario4c.article;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ArticleRepository extends JpaRepository<Article, Long> {

    List<Article> findByStorageId(Long storageId);

    List<Article> findByCategoryId(Long categoryId);

    @Modifying
    @Query(value = "UPDATE article SET on_stock = on_stock + :quantity WHERE id = :idArticle", nativeQuery = true)
    void incrementStock(@Param("quantity") long quantity, @Param("idArticle") Long articleId);

    @Modifying
    @Query(value = "UPDATE article SET on_stock = on_stock - 1 WHERE id = :idArticle AND on_stock > 0", nativeQuery = true)
    void decrementStock(@Param("idArticle") Long articleId);

    @Query(value = "SELECT COUNT(*) > 0 FROM article a JOIN storage s ON a.storage_id = s.id WHERE a.id = :articleId AND s.category_id = a.category_id" , nativeQuery = true)
    boolean isArticleInCorrectCategory(@Param("articleId") Long articleId, @Param("storageId") Long storageId);
}
