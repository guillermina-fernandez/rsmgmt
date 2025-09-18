const validateCuit = (value) => {
    if (!value) {
      return 'CUIT/CUIL es requerido.';
    }

    if (value.length !== 13) {
      return 'CUIT/CUIL debe tener 13 caracteres (xx-xxxxxxxx-x)';
    }

    const cuit_nro = value.replace(/-/g, '');
    const codes = '6789456789';
    const verificador = parseInt(cuit_nro[cuit_nro.length - 1]);
    let resultado = 0;

    for (let x = 0; x < 10; x++) {
      const digitoValidador = parseInt(codes[x]) || 0;
      const digito = parseInt(cuit_nro[x]) || 0;
      const digitoValidacion = digitoValidador * digito;
      resultado += digitoValidacion;
    }

    resultado = resultado % 11;
    const isValid = resultado === verificador;

    return isValid || 'CUIT/CUIL Inválido.';
};

export default validateCuit;
