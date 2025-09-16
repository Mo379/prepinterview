from django.conf import settings
from django.db import transaction
from sources.models import Chunk
from core.utils import h_encode


def _create_chunks(source_obj, chunk_values, chunk_embeddings, start_index=0):
    try:
        # build a list of Chunk instances
        chunks = [
            Chunk(
                source=source_obj,
                number=i + start_index,
                content=chunk_text,
                embedding=chunk_emb,
            )
            for i, (chunk_text, chunk_emb) in enumerate(
                zip(chunk_values, chunk_embeddings)
            )
        ]

        # wrap in a transaction for atomicity
        with transaction.atomic():
            Chunk.objects.bulk_create(
                chunks,
                update_conflicts=True,  # enable upsert
                update_fields=["content", "embedding"],
                # fields that uniquely identify a row
                unique_fields=["source_id", "number"],
            )
    except Exception as e:
        raise e
    else:
        return True


def process_pdf(source_obj, json_data):
    try:
        response = json_data["ai_response"]
        page_chunk_values = response["page_chunks"]
        page_chunk_embeddings = response["page_chunks_enriched_embedding"]
        start_index = 0
        for page_values, page_embedding in zip(
            page_chunk_values, page_chunk_embeddings
        ):
            _create_chunks(
                source_obj, page_values, page_embedding, start_index=start_index
            )
            start_index += len(page_values)

        final_content = []

        for page in json_data["ai_response"]["full_content"]['pages']:
            markdown = page['markdown'].replace(
                '](img',
                f']({settings.CDN_URL}/source_files/{h_encode(source_obj.id)}/img'
            )
            final_content.append(markdown)

        source_obj.full_content = '\n\n ___ \n\n'.join(final_content)
        source_obj.concept_outline = {
            'concepts': response['concepts_response']
        }
        source_obj.save()
    except Exception as e:
        print(e)
        return False
    else:
        return True


def process_img(source_obj, json_data):
    try:
        response = json_data["ai_response"]
        chunk_values = response["page_chunks"]
        chunk_embeddings = response["page_chunks_enriched_embedding"]
        _create_chunks(source_obj, chunk_values, chunk_embeddings)
    except Exception as e:
        print(e)
        return False
    else:
        return True


def process_text(source_obj, json_data):
    try:
        response = json_data["ai_response"]
        chunk_values = response["page_chunks"]
        chunk_embeddings = response["page_chunks_enriched_embedding"]
        _create_chunks(source_obj, chunk_values, chunk_embeddings)
    except Exception as e:
        print(e)
        return False
    else:
        return True


def process_web(source_obj, json_data):
    try:
        response = json_data["ai_response"]
        chunk_values = response["page_chunks"]
        chunk_embeddings = response["page_chunks_enriched_embedding"]
        _create_chunks(source_obj, chunk_values, chunk_embeddings)
    except Exception as e:
        print(e)
        return False
    else:
        return True
