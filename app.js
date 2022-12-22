require("colors");

const { guardarDB, leerDB } = require("./helpers/guardarArchivo");
const {
    inquirerMenu,
    pause,
    leerInput,
    listadoTareasBorrar,
    confirmar,
    mostrarListadoChecklist,
} = require("./helpers/inquirer");
const Tareas = require("./models/Tareas");

const main = async () => {
    let opt = "";
    const tareas = new Tareas();
    const tareasDB = leerDB();

    if (tareasDB) {
        // cargar Tareas
        tareas.cargarTareasFromArray(tareasDB);
    }
    do {
        opt = await inquirerMenu();

        switch (opt) {
            case "1":
                // crear tarear
                const desc = await leerInput("Descripción:");
                tareas.crearTarea(desc);
                break;

            case "2":
                // listar tareas
                tareas.listadoCompleto();
                break;

            case "3":
                // listar tareas completadas
                tareas.listarPorEstado(true);
                break;

            case "4":
                // listar tareas incompletas
                tareas.listarPorEstado(false);
                break;

            case "5":
                // Completado | Pendiente
                const ids = await mostrarListadoChecklist(tareas.listadoArr);
                tareas.toggleComplete( ids );
                break;

            case "6":
                // borrar tareas
                const id = await listadoTareasBorrar(tareas.listadoArr);
                if (id !== 0) {
                    const ok = await confirmar("¿Está seguro?");
                    if (ok) {
                        tareas.borrarTarea(id);
                        console.log("Tarrea Borrada");
                    }
                }
                break;

            default:
                break;
        }

        guardarDB(tareas.listadoArr);

        await pause();
    } while (opt !== "0");
};

main();
