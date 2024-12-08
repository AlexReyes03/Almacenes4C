package utez.edu.mx.inventario4c.modules.article;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import utez.edu.mx.inventario4c.modules.category.Category;
import utez.edu.mx.inventario4c.modules.storage.Storage;

import java.util.List;

@Entity
@Table(name = "article")
public class Article {

    //------------------------------ ATRIBUTOS ------------------------//
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private long id;

    @NotBlank(message = "El nombre es obligatorio")
    @Pattern(
            regexp = "^([A-ZÁÉÍÓÚÑ]{1}[a-záéíóúñ]+\\s*)*$",
            message = "El nombre debe comenzar con mayúscula y solo puede contener letras"
    )
    @Column(name = "name", nullable = false)
    private String name;

    @NotBlank(message = "La descripción es obligatoria")
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Min(value = 1, message = "La cantidad debe ser mayor a 1")
    @Column(name = "on_stock", nullable = false, columnDefinition = "BIGINT DEFAULT 0")
    private long onStock;

    @Column(name = "registered_on", nullable = false)
    private String registeredOn;

    @NotNull(message = "La categoría no puede estar vacía")
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ManyToMany(mappedBy = "articles")
    @JsonIgnore
    private List<Storage> storages;

    //------------------------ CONSTRUCTORES -----------------------//

    //1.-Vacio

    public Article() {
    }

    //2.- Todos los atributos de la clase sin ID


    public Article(String name, String description, long onStock, String registeredOn) {
        this.name = name;
        this.description = description;
        this.onStock = onStock;
        this.registeredOn = registeredOn;
    }

    //3.- Todos los atributos de la clase con las de relacion e ID
    public Article(long id, String name, String description, long onStock, String registeredOn, Category category, List<Storage> storages) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.onStock = onStock;
        this.registeredOn = registeredOn;
        this.category = category;
        this.storages = storages;
    }

    //4.-Todos los atibutos de la clase y relacion sin el ID
    public Article(String name, String description, long onStock, String registeredOn, Category category, List<Storage> storages) {
        this.name = name;
        this.description = description;
        this.onStock = onStock;
        this.registeredOn = registeredOn;
        this.category = category;
        this.storages = storages;
    }

    //5.- Todos los actibutos de la clase con id
    public Article(long id, String name, String description, long onStock, String registeredOn) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.onStock = onStock;
        this.registeredOn = registeredOn;
    }


    //---------------------- GETTERS Y SETTERS --------------------//

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

    public String getRegisteredOn() {
        return registeredOn;
    }

    public void setRegisteredOn(String registeredOn) {
        this.registeredOn = registeredOn;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public List<Storage> getStorages() {
        return storages;
    }

    public void setStorages(List<Storage> storages) {
        this.storages = storages;
    }
}