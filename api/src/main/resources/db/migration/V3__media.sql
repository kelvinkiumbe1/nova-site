create table media_asset (
    id              bigserial primary key,
    storage_key     varchar(300) not null unique,
    url             varchar(500) not null,
    content_type    varchar(50)  not null,
    width           int,
    height          int,
    size_bytes      bigint       not null,
    original_name   varchar(300),
    alt_text        varchar(300),
    caption         varchar(300),
    show_in_gallery boolean      not null default false,
    sort_order      int          not null default 0,
    created_at      timestamptz  not null default now()
);
create index media_asset_gallery_idx on media_asset (show_in_gallery, sort_order, id desc);
