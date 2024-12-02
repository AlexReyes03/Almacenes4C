package utez.edu.mx.inventario4c.auth.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class AuthLoginDTO {
    @NotBlank(message = "El nombre de usuario es obligatorio")
    @Pattern(
            regexp = "^[a-zA-Z0-9]+$",
            message = "El nombre de usuario solo puede contener letras y números"
    )
    private String user;

    @NotBlank(message = "La contraseña es obligatoria")
    private String password;

    // CONSTRUCTORES

    // Constructor vacío
    public AuthLoginDTO() {
    }

    // Constructor con parámetros
    public AuthLoginDTO(String password, String user) {
        this.password = password;
        this.user = user;
    }

    // GETERS Y SETTERS
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }
}
