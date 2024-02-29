import { MIN_PASSWORD_LENGTH, MIN_USERNAME_LENGTH, MAX_PASSWORD_LENGTH, MAX_USERNAME_LENGTH } from "../../constants/Lengths.ts";
import { NUM_PASSWORD_SOFT_REQS } from "../../constants/NumReqs.ts";
import { INVALID_EMAIL_MESSAGE } from "../../constants/Messages.ts";
import { ALLOWED_DOMAIN_EXTENSIONS } from "../../constants/AllowedDomainExtensions.ts";

export function validatePassword(password: string, annoying: boolean) : string {
    if (!annoying && password.length === 0) {
        //don't want to annoy the user, they know an empty password is invalid
        return '';
    } else if (password.length < MIN_PASSWORD_LENGTH) {
        return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
    } else if (password.length > MAX_PASSWORD_LENGTH) {
        return `Password must be at most ${MAX_PASSWORD_LENGTH} characters`
    } else {
        //must meet NUM_PASSWORD_SOFT_REQS of 2 requirements
        var hasLower = /[a-z]/.test(password);
        var hasUpper = /[A-Z]/.test(password);
        var hasDigit = /\d/.test(password);
        var hasSpecial = /[^a-zA-Z\d]/.test(password);
        var softReqsMet = 0;
        if (hasLower) softReqsMet++
        if (hasUpper) softReqsMet++
        if (hasDigit) softReqsMet++
        if (hasSpecial) softReqsMet++
        if (softReqsMet < NUM_PASSWORD_SOFT_REQS) {
            return `Password must have at least ${NUM_PASSWORD_SOFT_REQS} of the following:
            at least 1 lower case letter
            at least 1 upper case letter
            at least 1 number
            at least 1 special character.`;
        } else {
            return ''
        }
    }
}   

export function validateUsername(username: string, annoying: boolean) : string {
    if (!annoying && username.length === 0) {
        //don't want to annoy the user, they know an empty password is invalid
        return '';
    } else if (username.length < MIN_USERNAME_LENGTH) {
        return `Username must be at least ${MIN_USERNAME_LENGTH} characters`
    } else if (username.length > MAX_USERNAME_LENGTH) {
        return `Username must be at most ${MAX_USERNAME_LENGTH} characters`
    } else {
        if (/^.*[-]{2}.*$/.test(username) || /^.*[.]{2}.*$/.test(username) || /^.*[_]{2}.*$/.test(username)) {
            return `Username must not contain consecutive dashes, periods, or underscores`;
        } else {
            return ''
        }
    }
}

export function validateEmail(email: string, annoying: boolean) : string {
    let emailLowerCase = email.toLowerCase();
    let atSplit: string[] = emailLowerCase.split('@');
    if (atSplit.length !== 2) {
        return INVALID_EMAIL_MESSAGE;
    }
    let prefix: string = atSplit[0];
    let domain: string = atSplit[1];
    if (prefix.length < 1 || prefix.length > 64 || domain.length > 255) {
        return INVALID_EMAIL_MESSAGE;
    }
    if (/[^a-z\d-_.]/.test(prefix) || prefix[0] === '-' || prefix[0] === '_' || prefix[0] === '.'
        || prefix[prefix.length - 1] === '-' || prefix[prefix.length - 1] === '_' || prefix[prefix.length - 1] === '.'
        || /^.*[-]{2}.*$/.test(prefix) || /^.*[.]{2}.*$/.test(prefix) || /^.*[_]{2}.*$/.test(prefix)) {
        return INVALID_EMAIL_MESSAGE;
    }
    let dotSplit: string[] = domain.split('.');
    if (dotSplit.length < 2) {
        return INVALID_EMAIL_MESSAGE;
    }
    for (let i = 0; i < dotSplit.length - 1; ++i) {
        if (dotSplit[i].length < 1 || dotSplit[i].length > 63) {
            return INVALID_EMAIL_MESSAGE;
        }
        if (/[^a-z\d-]/.test(dotSplit[i])) {
            return INVALID_EMAIL_MESSAGE;
        }
    }
    if (!(ALLOWED_DOMAIN_EXTENSIONS.includes(dotSplit[dotSplit.length - 1]))) {
        return INVALID_EMAIL_MESSAGE;
    }

    return '';
}


