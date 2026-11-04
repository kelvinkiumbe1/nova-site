create table admin_user (
    id            bigserial primary key,
    email         varchar(200) not null unique,
    password_hash varchar(200) not null,
    full_name     varchar(200) not null,
    role          varchar(20)  not null default 'ADMIN',
    enabled       boolean      not null default true,
    created_at    timestamptz  not null default now()
);

create table service (
    id              bigserial primary key,
    slug            varchar(120) not null unique,
    title           varchar(200) not null,
    category        varchar(20)  not null,          -- CONSTRUCTION | GENERAL
    summary         varchar(500) not null,
    body            text         not null default '',
    highlights      text[]       not null default '{}',
    image_url       varchar(500),
    sort_order      int          not null default 0,
    featured        boolean      not null default false,
    published       boolean      not null default true,
    seo_title       varchar(200),
    seo_description varchar(300),
    created_at      timestamptz  not null default now(),
    updated_at      timestamptz  not null default now()
);

create table project (
    id               bigserial primary key,
    slug             varchar(120) not null unique,
    title            varchar(200) not null,
    location         varchar(200),
    service_slug     varchar(120),
    description      text         not null default '',
    cover_image_url  varchar(500),
    before_image_url varchar(500),
    after_image_url  varchar(500),
    gallery          text[]       not null default '{}',
    completed_on     date,
    featured         boolean      not null default false,
    published        boolean      not null default true,
    created_at       timestamptz  not null default now(),
    updated_at       timestamptz  not null default now()
);

create table testimonial (
    id          bigserial primary key,
    author_name varchar(200) not null,
    author_role varchar(200),
    company     varchar(200),
    quote       text         not null,
    sort_order  int          not null default 0,
    published   boolean      not null default true,
    created_at  timestamptz  not null default now()
);

create table site_settings (
    id             int primary key check (id = 1),
    company_name   varchar(200) not null,
    tagline        varchar(300),
    phone          varchar(50),
    whatsapp       varchar(50),          -- international format without +, e.g. 2547XXXXXXXX
    email          varchar(200),
    address        varchar(300),
    business_hours varchar(200),
    facebook_url   varchar(300),
    instagram_url  varchar(300),
    linkedin_url   varchar(300),
    tiktok_url     varchar(300),
    map_embed_url  varchar(1000),
    service_areas  text[] not null default '{}',
    updated_at     timestamptz not null default now()
);

create table quote_request (
    id             bigserial primary key,
    full_name      varchar(200) not null,
    company        varchar(200),
    phone          varchar(50)  not null,
    email          varchar(200),
    service_slug   varchar(120),
    property_type  varchar(100),
    site_location  varchar(300) not null,
    project_stage  varchar(100),
    size_estimate  varchar(100),
    preferred_date date,
    message        text,
    status         varchar(20)  not null default 'NEW',  -- NEW | CONTACTED | QUOTED | WON | LOST
    admin_notes    text,
    source_ip      varchar(64),
    created_at     timestamptz  not null default now(),
    updated_at     timestamptz  not null default now()
);
create index quote_request_status_idx on quote_request (status, created_at desc);
