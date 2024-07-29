-- CreateTable
CREATE TABLE "api_key" (
    "api_key_id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "api_key" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "api_key_pkey" PRIMARY KEY ("api_key_id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "audit_id" SERIAL NOT NULL,
    "url_id" UUID NOT NULL,
    "action" VARCHAR(50) NOT NULL,
    "changed_by" UUID NOT NULL,
    "change_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "details" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("audit_id")
);

-- CreateTable
CREATE TABLE "logo" (
    "logo_id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "logo_path" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "logo_pkey" PRIMARY KEY ("logo_id")
);

-- CreateTable
CREATE TABLE "url" (
    "url_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "original_url" TEXT,
    "short_url" VARCHAR(20) NOT NULL,
    "logo_id" INTEGER,
    "tag_id" INTEGER,
    "url_type" VARCHAR(10),
    "associated" BOOLEAN NOT NULL DEFAULT false,
    "expiration_date" DATE,
    "status" VARCHAR(10) NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "is_pre_generated" BOOLEAN NOT NULL DEFAULT false,
    "associated_at" TIMESTAMP(6),

    CONSTRAINT "url_pkey" PRIMARY KEY ("url_id")
);

-- CreateTable
CREATE TABLE "url_click" (
    "click_id" SERIAL NOT NULL,
    "url_id" UUID NOT NULL,
    "access_date" DATE NOT NULL,
    "access_time" TIME(6) NOT NULL,
    "ip_address" VARCHAR(45) NOT NULL,
    "user_agent" TEXT NOT NULL,
    "referrer" TEXT,
    "country" VARCHAR(50),
    "city" VARCHAR(50),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "url_click_pkey" PRIMARY KEY ("click_id")
);

-- CreateTable
CREATE TABLE "url_tag" (
    "tag_id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "tag_name" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "url_tag_pkey" PRIMARY KEY ("tag_id")
);

-- CreateTable
CREATE TABLE "user" (
    "user_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "role_id" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "user_role" (
    "role_id" SERIAL NOT NULL,
    "role_name" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_role_pkey" PRIMARY KEY ("role_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "api_key_api_key_key" ON "api_key"("api_key");

-- CreateIndex
CREATE UNIQUE INDEX "url_short_url_key" ON "url"("short_url");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_role_role_name_key" ON "user_role"("role_name");

-- AddForeignKey
ALTER TABLE "api_key" ADD CONSTRAINT "api_key_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_changed_by_fkey" FOREIGN KEY ("changed_by") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_url_id_fkey" FOREIGN KEY ("url_id") REFERENCES "url"("url_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logo" ADD CONSTRAINT "logo_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "url" ADD CONSTRAINT "url_logo_id_fkey" FOREIGN KEY ("logo_id") REFERENCES "logo"("logo_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "url" ADD CONSTRAINT "url_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "url_tag"("tag_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "url" ADD CONSTRAINT "url_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "url_click" ADD CONSTRAINT "url_click_url_id_fkey" FOREIGN KEY ("url_id") REFERENCES "url"("url_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "url_tag" ADD CONSTRAINT "url_tag_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "user_role"("role_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
