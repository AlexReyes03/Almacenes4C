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

    @JsonIgnore
    @OneToMany(mappedBy = "category")
    private List<Storage> storages;

    @JsonIgnore
    @OneToMany(mappedBy = "category")
    private List<Article> articles;

    public Category() {
    }

    public Category(String name) {
        this.name = name;
    }

    public Category(int id, String name) {
        this.id = id;
        this.name = name;
    }

    public Category(String name, List<Storage> storages, List<Article> articles) {
        this.name = name;
        this.storages = storages;
        this.articles = articles;
    }

    public Category(int id, String name, List<Storage> storages, List<Article> articles) {
        this.id = id;
        this.name = name;
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

    public void setName(String nombre) {
        this.name = nombre;
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
