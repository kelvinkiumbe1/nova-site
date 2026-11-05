-- Second phone line, and Nova's real contact details (only filled where still empty).
alter table site_settings add column phone_alt varchar(50);

update site_settings
set phone     = coalesce(phone, '0769 479 951'),
    phone_alt = coalesce(phone_alt, '0180 502 715'),
    whatsapp  = coalesce(whatsapp, '254180502715'),
    email     = coalesce(email, 'novasitecare@gmail.com'),
    updated_at = now()
where id = 1;
