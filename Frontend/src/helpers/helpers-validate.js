export const helpers={
    nitIsValid:(value)=>{
        var nit=value.toString();
        if (!nit) {
            return true;
        }
        var nitRegExp = new RegExp('^[0-9]+(-?[0-9kK])?$');

        if (!nitRegExp.test(nit)) {
            return false;
        }

        nit = nit.replace(/-/, '');
        var lastChar = nit.length - 1;
        var number = nit.substring(0, lastChar);
        var expectedCheker = nit.substring(lastChar, lastChar + 1).toLowerCase();

        var factor = number.length + 1;
        var total = 0;

        for (var i = 0; i < number.length; i++) {
            var character = number.substring(i, i + 1);
            var digit = parseInt(character, 10);

            total += (digit * factor);
            factor = factor - 1;
        }

        var modulus = (11 - (total % 11)) % 11;
        var computedChecker = (modulus == 10 ? "k" : modulus.toString());

        return expectedCheker === computedChecker;
    },
    money:(number)=>{
        return 'Q ' + number.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    },
    quantity:(number)=>{
        var myNumber=parseFloat(number);
        return myNumber.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    },
    correo:(value)=>{
        var email = value.toString()
        var regexEmail = new RegExp(/^([\w+-.%]+@[\w-.]+\.[A-Za-z]{2,4},*[\W]*)+$/);
        if (!email) {
          return true;
        }
        if (!regexEmail.test(email)) {
          return false;
        } else {
          return true;
        }
    }
}
{/* <div class="form-group">
<label>NIT</label>
<input
  ref="nameInput"
  :class="{ 'is-invalid': $v.clientNit.$error }"
  v-model.trim="clientNit"
  class="form-control"
  placeholder="C/F"
  @input="$v.clientNit.$touch()"
>
<div v-if="$v.clientNit.$error">
  <span
    v-if="!$v.clientNit.nit"
    class="help-block help-block-error"
  >El número de nit no es válido.</span>
</div>
</div> */}