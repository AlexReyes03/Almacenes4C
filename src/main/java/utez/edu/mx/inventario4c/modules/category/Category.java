package utez.edu.mx.inventario4c.modules.category;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import utez.edu.mx.inventario4c.modules.article.Article;
import utez.edu.mx.inventario4c.modules.storage.Storage;

import java.util.List;

@Entity
@Table(name="category")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", nullable = false)
    private int id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "color", nullable = false)
    private long color;

    @JsonIgnore
    @OneToMany(mappedBy = "category")
    private List<Storage> storages;

    @JsonIgnore
    @OneToMany(mappedBy = "category")
    private List<Article> articles;

    public Category() {
    }

    public Category(String name, long color) {
        this.name = name;
        this.color = color;
    }

    public Category(int id, String name, long color) {
        this.id = id;
        this.name = name;
        this.color = color;
    }

    public Category(String name, long color, List<Storage> storages, List<Article> articles) {
        this.name = name;
        this.color = color;
        this.storages = storages;
        this.articles = articles;
    }

    public Category(int id, String name, long color, List<Storage> storages, List<Article> articles) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.storages = storages;
        this.articles = articles;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public long getColor() {
        return color;
    }

    public void setColor(long color) {
        this.color = color;
    }

    public List<Storage> getStorages() {
        return storages;
    }

    public void setStorages(List<Storage> storages) {
        this.storages = storages;
    }

    public List<Article> getArticles() {
        return articles;
    }

    public void setArticles(List<Article> articles) {
        this.articles = articles;
    }
}