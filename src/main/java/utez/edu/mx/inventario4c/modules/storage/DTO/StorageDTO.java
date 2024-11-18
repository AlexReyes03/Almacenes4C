package utez.edu.mx.inventario4c.modules.storage.DTO;

import java.util.List;

public class StorageDTO {
    private long id;
    private String name;
    private long userId;
    private long categoryId;
    private List<Long> articleIds;

    // CONSTRUCTORES

    // Constructor vacío
    public StorageDTO() {}

    // Constructor completo
    public StorageDTO(long id, String name, long userId, long categoryId, List<Long> articleIds) {
        this.id = id;
        this.name = name;
        this.userId = userId;
        this.categoryId = categoryId;
        this.articleIds = articleIds;
    }

    // GETTERS AND SETTERS

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

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(long categoryId) {
        this.categoryId = categoryId;
    }

    public List<Long> getArticleIds() {
        return articleIds;
    }

    public void setArticleIds(List<Long> articleIds) {
        this.articleIds = articleIds;
    }
}
