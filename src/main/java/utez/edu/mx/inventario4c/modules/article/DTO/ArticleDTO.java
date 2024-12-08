package utez.edu.mx.inventario4c.modules.article.DTO;

import utez.edu.mx.inventario4c.modules.category.Category;
import utez.edu.mx.inventario4c.modules.storage.Storage;

import java.util.List;

public class ArticleDTO {
    private long id;
    private String name;
    private String description;
    private long onStock;
    private Category category;
    private List<Long> storageIds;

    // Constructor vacío
    public ArticleDTO() {}

    // Constructor completo


    public ArticleDTO(long id, String name, String description, long onStock, Category category, List<Long> storageIds) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.onStock = onStock;
        this.category = category;
        this.storageIds = storageIds;
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

    public long getOnStock() {
        return onStock;
    }

    public void setOnStock(long onStock) {
        this.onStock = onStock;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public List<Long> getStorageIds() {
        return storageIds;
    }

    public void setStorageIds(List<Long> storageIds) {
        this.storageIds = storageIds;
    }
}