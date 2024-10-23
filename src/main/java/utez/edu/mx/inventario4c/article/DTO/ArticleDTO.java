package utez.edu.mx.inventario4c.article.DTO;

public class ArticleDTO {
    private String name;
    private String description;
    private Long categoryId; //duda di debe de ser long, int o el paquete.
    private Long storageId;//duda di debe de ser long, int o el paquete.

    //Constructor vacio
    public ArticleDTO() {
    }

    //Constructor completo
    public ArticleDTO(String name, String description, Long categoryId, Long storageId) {
        this.name = name;
        this.description = description;
        this.categoryId = categoryId;
        this.storageId = storageId;
    }

    // Getters y Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public Long getStorageId() {
        return storageId;
    }

    public void setStorageId(Long storageId) {
        this.storageId = storageId;
    }
}