package utez.edu.mx.inventario4c.modules.rol;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import utez.edu.mx.inventario4c.modules.user.User;

import java.util.List;

@Entity
@Table(name = "rol")
public class Rol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private int id;

    @Column(name = "name", nullable = false)
    private String name;

    // --------- ATRIBUTOS DE RELACIÓN CON OTRAS COLUMNAS
    @OneToMany(mappedBy = "rol")
    @JsonIgnore
    private List<User> users;

    public Rol() { }

    public Rol(String name) {
        this.name = name;
    }

    public Rol(int id, String name) {
        this.id = id;
        this.name = name;
    }

    public Rol(String name, List<User> users) {
        this.name = name;
        this.users = users;
    }

    public Rol(int id, String name, List<User> users) {
        this.id = id;
        this.name = name;
        this.users = users;
    }

    // --------- GETTERS AND SETTERS

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

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }
}
