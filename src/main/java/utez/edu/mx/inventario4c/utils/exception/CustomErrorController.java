package utez.edu.mx.inventario4c.utils.exception;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class CustomErrorController implements ErrorController {

    @GetMapping("/error")
    public String handleError(HttpServletRequest request) {
        // Obtener el código de estado de la solicitud
        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);

        if (status != null) {
            int statusCode = Integer.parseInt(status.toString());

            if (statusCode == HttpStatus.FORBIDDEN.value()) {
                // Retornar plantilla 403.html
                return "403";
            }
            if (statusCode == HttpStatus.NOT_FOUND.value()) {
                // Retornar plantilla 404.html
                return "404";
            }
        }

        // Retornar una plantilla genérica para otros errores
        return "error";
    }
}
