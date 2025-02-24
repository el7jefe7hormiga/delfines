
const fdn_edad = (fdn) => {
  const fdn_formateado = moment(fdn).format("DD/MMM/YYYY"); // la fecha de nac formateada
  const YY = moment(Date()).format("DD/MMM/YYYY"); // hoy
  const edad = moment(YY).diff(fdn_formateado, "years"); // hoy-fdn
  const res = fdn_formateado + " (" + edad + ") años";
  return res;
};


const url_API = "https://delfines-api.vercel.app/api/"  //"http://192.168.1.123:3000/api";


async function obtenerJugadores(donde = 'jugadoresTable') {
  const res = await fetch(url_API + "/jugadores");
  const jugadores = await res.json();
  const jugadoresTable = document.getElementById(donde);
  if (donde === 'jugadoresTable') {
    jugadoresTable.innerHTML = jugadores
      .map(
        (jugador) => `
      <tr class="text-sm">
          <td class="border px-2 py-1">${jugador.nombre}</td>
          <td class="border px-2 py-1">${fdn_edad(jugador.fdn)}</td>
          <td class="border px-2 py-1">${jugador.direccion}</td>
          <td class="border px-2 py-1">${jugador.escuela}</td>
          <td class="border px-2 py-1">${jugador.padres}</td>
          <td class="border px-2 py-1">${jugador.telefono}</td>
          <td class="border px-2 py-1">${jugador.talla}</td>
          <td class="border px-2 py-1">
              <button class="text-green-700 font-semibold px-2 py-1 rounded" onclick="editarJugador(${jugador.id
          })"> Editar </button>
              <button class="text-red-500 font-semibold px-2 py-1 rounded" onclick="eliminarJugador(${jugador.id
          })"> Eliminar </button>
          </td>
      </tr>
  `
      )
      .join("");
  } else {
    jugadoresTable.innerHTML = jugadores
      .map(
        (jugador) => `
      <tr class="text-sm">
          <td class="w-fit px-2 py-1 border border-gray-300">${jugador.nombre}</td>
          <td class="w-fit px-2 py-1 border border-gray-300">${fdn_edad(jugador.fdn)}</td>
          <td class="w-fit px-2 py-1 border border-gray-300">${jugador.direccion}</td>
          <td class="w-fit px-2 py-1 border border-gray-300">${jugador.escuela}</td>
          <td class="w-fit px-2 py-1 border border-gray-300">${jugador.padres}</td>
          <td class="w-fit px-2 py-1 border border-gray-300">${jugador.telefono}</td>
          <td class="w-fit px-2 py-1 border border-gray-300">${jugador.talla}</td>
      </tr>
  `
      )
      .join("");
  }
}

async function guardarJugador() {
  const id = document.getElementById("jugadorId").value;
  const nombre = document.getElementById("nombre").value;
  const fdn = document.getElementById("fdn").value;
  const direccion = document.getElementById("direccion").value;
  const escuela = document.getElementById("escuela").value;
  const padres = document.getElementById("padres").value;
  const telefono = document.getElementById("telefono").value;
  const talla = document.getElementById("talla").value;

  const jugador = {
    nombre,
    fdn,
    direccion,
    escuela,
    padres,
    telefono,
    talla,
  };
  const method = id ? "PUT" : "POST";
  const url = `${url_API}/jugadores${id ? `/${id}` : ""}`;

  console.log('Guardando al jugador:');
  console.log(jugador);
  console.log(method, url);

  await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(jugador),
  });

  document.getElementById("jugadorForm").reset();
  obtenerJugadores();
  closeModal('frmModal');
}

async function editarJugador(id) {
  const res = await fetch(`${url_API}/jugadores/${id}`);
  const jugador = await res.json();
  document.getElementById("jugadorId").value = jugador.id;
  document.getElementById("nombre").value = jugador.nombre;
  document.getElementById("fdn").value = moment(jugador.fdn).format("YYYY-MM-DD");
  document.getElementById("direccion").value = jugador.direccion;
  document.getElementById("escuela").value = jugador.escuela;
  document.getElementById("padres").value = jugador.padres;
  document.getElementById("telefono").value = jugador.telefono;
  document.getElementById("talla").value = jugador.talla;
  openModal('frmModal')
}

async function eliminarJugador(id) {
  if (confirm("¿Estás seguro de que quieres eliminar este jugador?")) {
    await fetch(`${url_API}/jugadores/${id}`, {
      method: "DELETE",
    });
    obtenerJugadores();
  }
}
