package utez.edu.mx.inventario4c.modules.article.DTO;

public class ArticleDTO {
    private long id;
    private String name;
    private String description;
    private long categoryId;
    private long storageId;

    // Constructor vacío
    public ArticleDTO() {}

    // Constructor completo
    public ArticleDTO(String name, String description, long categoryId, long storageId) {
        this.name = name;
        this.description = description;
        this.categoryId = categoryId;
        this.storageId = storageId;
    }

    // Getters y Setters
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

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

    public long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(long categoryId) {
        this.categoryId = categoryId;
    }

    public long getStorageId() {
        return storageId;
    }

    public void setStorageId(long storageId) {
        this.storageId = storageId;
    }
}