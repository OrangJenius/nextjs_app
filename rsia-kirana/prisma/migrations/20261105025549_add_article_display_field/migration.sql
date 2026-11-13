-- AlterTable
ALTER TABLE `articles` ADD COLUMN `category` VARCHAR(191) NOT NULL DEFAULT 'berita',
    ADD COLUMN `excerpt` TEXT NULL,
    ADD COLUMN `hashtag` VARCHAR(191) NULL,
    ADD COLUMN `source` VARCHAR(191) NULL,
    ADD COLUMN `tag` VARCHAR(191) NULL;
