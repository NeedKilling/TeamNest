
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='personnel' AND column_name='age') THEN
        ALTER TABLE "personnel" ALTER COLUMN "age" DROP NOT NULL;
    END IF;
END $$;


DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='personnel' AND column_name='city') THEN
        ALTER TABLE "personnel" ALTER COLUMN "city" DROP NOT NULL;
    END IF;
END $$;


DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='personnel' AND column_name='short_Resume') THEN
        ALTER TABLE "personnel" ALTER COLUMN "short_Resume" DROP NOT NULL;
    END IF;
END $$;


DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='personnel' AND column_name='education') THEN
        ALTER TABLE "personnel" ALTER COLUMN "education" DROP NOT NULL;
    END IF;
END $$;


DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='personnel' AND column_name='skills') THEN
        ALTER TABLE "personnel" ALTER COLUMN "skills" DROP NOT NULL;
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='personnel' AND column_name='specialization_id') THEN
        ALTER TABLE "personnel" ALTER COLUMN "specialization_id" DROP NOT NULL;
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='personnel' AND column_name='categories_id') THEN
        ALTER TABLE "personnel" ALTER COLUMN "categories_id" DROP NOT NULL;
    END IF;
END $$;


DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='personnel' AND column_name='telegram') THEN
        ALTER TABLE "personnel" ADD COLUMN "telegram" varchar(255);
    END IF;
END $$;


DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='personnel' AND column_name='vk') THEN
        ALTER TABLE "personnel" ADD COLUMN "vk" varchar(255);
    END IF;
END $$;


DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='personnel' AND column_name='userId') THEN
        ALTER TABLE "personnel" ADD COLUMN "userId" varchar(255) NOT NULL DEFAULT '';
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='user' AND column_name='personnel_id') THEN
        ALTER TABLE "user" ADD COLUMN "personnel_id" varchar;
    END IF;
END $$;


DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_personnel_id_personnel_id_fk') THEN
        ALTER TABLE "user" ADD CONSTRAINT "user_personnel_id_personnel_id_fk" FOREIGN KEY ("personnel_id") REFERENCES "public"."personnel"("id") ON DELETE no action ON UPDATE no action;
    END IF;
END $$;


DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='personnel' AND column_name='first_name') THEN
        ALTER TABLE "personnel" DROP COLUMN "first_name";
    END IF;
END $$;


DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='personnel' AND column_name='last_name') THEN
        ALTER TABLE "personnel" DROP COLUMN "last_name";
    END IF;
END $$;


DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='personnel' AND column_name='contacts') THEN
        ALTER TABLE "personnel" DROP COLUMN "contacts";
    END IF;
END $$;